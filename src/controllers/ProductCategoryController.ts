import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { ProductCategory } from '../entity/ProductCategory';
import ResponseFormatter from '../helpers/ResponseFormatter';

export class ProductCategoryController {
  static all = async (req: Request, res: Response) => {
    try {
      const id = req.query.id as number | undefined;
      const limit = parseInt(req.query.limit as string) || 10; // Default limit to 10
      const name = req.query.name as string | undefined;
      const showProduct = req.query.show_product === 'true'; // Convert to boolean

      const categoryRepository = getRepository(ProductCategory);

      if (id) {
        const category = await categoryRepository.findOne({
          where: { id },
          relations: showProduct ? ['products'] : [], // Conditionally load relations
        });

        if (category) {
          return ResponseFormatter.success(res, category, 'Data kategori berhasil diambil');
        } else {
          return ResponseFormatter.error(res, null, 'Data kategori tidak ada', 400);
        }
      }

      let query = categoryRepository.createQueryBuilder('category');

      if (name) {
        query = query.where('category.name LIKE :name', { name: `%${name}%` });
      }

      if (showProduct) {
        query = query.leftJoinAndSelect('category.products', 'product');
      }

      const [result, total] = await query.skip(0).take(limit).getManyAndCount(); // Implement pagination as needed

      if (result.length > 0) {
        return ResponseFormatter.success(res, { data: result, total }, 'Data list kategori berhasil diambil');
      } else {
        return ResponseFormatter.error(res, [], 'Tidak ada data list kategori', 400);
      }
    } catch (error) {
      return ResponseFormatter.error(res, null, 'Internal Server Error', 500);
    }
  };
}
