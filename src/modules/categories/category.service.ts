import { categoryRepository } from "./category.repository";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export class CategoryService {
  async getAllCategories() {
    return categoryRepository.findAll();
  }

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new Error("Category not found");
    return category;
  }

  async getCategoryBySlug(slug: string) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) throw new Error("Category not found");
    return category;
  }

  async createCategory(input: CreateCategoryInput) {
    let slug = generateSlug(input.name);
    
    // Check if slug exists
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    return categoryRepository.create({
      name: input.name,
      slug,
      imageUrl: input.imageUrl || null,
    });
  }

  async updateCategory(id: string, input: UpdateCategoryInput) {
    const dataToUpdate: any = { ...input };
    
    if (input.name) {
      dataToUpdate.slug = generateSlug(input.name);
      
      const existing = await categoryRepository.findBySlug(dataToUpdate.slug);
      if (existing && existing.id !== id) {
        dataToUpdate.slug = `${dataToUpdate.slug}-${Date.now()}`;
      }
    }

    // Ensure empty strings for imageUrl are set to null in DB
    if (input.imageUrl === undefined) {
       delete dataToUpdate.imageUrl;
    } else if (input.imageUrl === null || input.imageUrl === "") {
       dataToUpdate.imageUrl = null;
    }

    return categoryRepository.update(id, dataToUpdate);
  }

  async deleteCategory(id: string) {
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
