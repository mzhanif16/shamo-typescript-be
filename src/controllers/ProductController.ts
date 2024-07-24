import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Product } from '../entity/Product';
import ResponseFormatter from '../helpers/ResponseFormatter';

export class ProductController {
  static all = async (req: Request, res: Response) => {
    try {
      const id = req.query.id as number | undefined;
      const limit = parseInt(req.query.limit as string) || 10; // Default limit to 10
      const name = req.query.name as string | undefined;
      const description = req.query.description as string | undefined;
      const tags = req.query.tags as string | undefined;
      const categories = req.query.categories as string | undefined;
      const priceFrom = parseFloat(req.query.price_from as string) || 0;
      const priceTo = parseFloat(req.query.price_to as string ) || Number.MAX_SAFE_INTEGER;

      const productRepository = getRepository(Product);

      if (id) {
        const product = await productRepository.findOne({ where: { id }, relations: ['category', 'galleries'] });
        if (product) {
          return ResponseFormatter.success(res, product, 'Data produk berhasil diambil');
        } else {
          return ResponseFormatter.error(res, null, 'Data produk tidak ada', 404);
        }
      }

      let query = productRepository.createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.galleries', 'galleries');

      if (name) {
        query = query.andWhere('product.name LIKE :name', { name: `%${name}%` });
      }

      if (description) {
        query = query.andWhere('product.description LIKE :description', { description: `%${description}%` });
      }

      if (tags) {
        query = query.andWhere('product.tags LIKE :tags', { tags: `%${tags}%` });
      }

      if (priceFrom) {
        query = query.andWhere('product.price >= :priceFrom', { priceFrom });
      }

      if (priceTo) {
        query = query.andWhere('product.price <= :priceTo', { priceTo });
      }

      if (categories) {
        query = query.andWhere('product.categories = :categories', { categories });
      }

      const [result, total] = await query.skip(0).take(limit).getManyAndCount(); // Implement pagination as needed

      if (result.length > 0) {
        return ResponseFormatter.success(res, { data: result, total }, 'Data list produk berhasil diambil');
      } else {
        return ResponseFormatter.error(res, [], 'Tidak ada data list produk', 400);
      }
    } catch (error) {
      return ResponseFormatter.error(res, error, 'Internal Server Error', 500);
    }
  };
}
