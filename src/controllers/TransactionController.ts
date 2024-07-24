import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Transaction } from '../entity/Transaction';
import { TransactionItem } from '../entity/TransactionItem';
import ResponseFormatter from '../helpers/ResponseFormatter';
import { User } from '../entity/User';

export class TransactionController {
  static all = async (req: Request, res: Response) => {
    try {
      const id = req.query.id as number | undefined;
      const limit = parseInt(req.query.limit as string) || 10; // Default limit to 10
      const status = req.query.status as string | undefined;

      const transactionRepository = getRepository(Transaction);
      const userRepository = getRepository(User);

      if (id) {
        const transaction = await transactionRepository.findOne({
          where: { id },
          relations: ['items', 'items.product'],
        });

        if (transaction) {
          return ResponseFormatter.success(res, transaction, 'Data transaksi berhasil diambil');
        } else {
          return ResponseFormatter.error(res, null, 'Data transaksi tidak ada', 404);
        }
      }

      const user = await userRepository.findOne({
        where: { id: (req as any).user?.id }, // Assuming req.user contains authenticated user
      });

      if (!user) {
        return ResponseFormatter.error(res, null, 'User not found', 404);
      }

      let query = transactionRepository.createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.items', 'item')
        .leftJoinAndSelect('item.product', 'product')
        .where('transaction.userId = :userId', { userId: user.id });

      if (status) {
        query = query.andWhere('transaction.status = :status', { status });
      }

      const [result, total] = await query.skip(0).take(limit).getManyAndCount(); // Implement pagination as needed

      if (result.length > 0) {
        return ResponseFormatter.success(res, { data: result, total }, 'Data list transaksi berhasil diambil');
      } else {
        return ResponseFormatter.error(res, [], 'Tidak ada data list transaksi', 400);
      }
    } catch (error) {
      return ResponseFormatter.error(res, null, 'Internal Server Error', 500);
    }
  };

  static checkout = async (req: Request, res: Response) => {
    try {
      // Validation
      const { items, total_price, shipping_price, status, address , payment} = req.body;

      if (!Array.isArray(items) || items.some(item => !item.id || !item.quantity)) {
        return ResponseFormatter.error(res, null, 'Invalid items data', 400);
      }

      if (typeof total_price !== 'number' || typeof shipping_price !== 'number') {
        return ResponseFormatter.error(res, null, 'Invalid price data', 400);
      }

      if (!['PENDING', 'SUCCESS', 'CANCELED', 'FAILED', 'SHIPPING', 'SHIPPED'].includes(status)) {
        return ResponseFormatter.error(res, null, 'Invalid status', 400);
      }

      const transactionRepository = getRepository(Transaction);
      const transactionItemRepository = getRepository(TransactionItem);
      const user = (req as any).user as User; // Assuming req.user contains authenticated user

      const transaction = transactionRepository.create({
        user: user, 
        address: address,
        payment: payment,
        totalPrice: total_price,
        shippingPrice: shipping_price,
        status: status,
      });

      await transactionRepository.save(transaction);

      for (const product of items) {
        await transactionItemRepository.save({
          userId: user.id,
          productId: product.id,
          transactionId: transaction.id,
          quantity: product.quantity,
        });
      }

      const transactionWithItems = await transactionRepository.findOne({
        where: { id: transaction.id },
        relations: ['items', 'items.product'],
      });

      return ResponseFormatter.success(res, transactionWithItems, 'Transaksi berhasil');
    } catch (error) {
      return ResponseFormatter.error(res, null, 'Internal Server Error', 500);
    }
  };
}
