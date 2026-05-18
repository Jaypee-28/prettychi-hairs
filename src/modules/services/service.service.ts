import { serviceRepository } from "./service.repository";
import { ServiceInput, UpdateServiceInput } from "./service.schema";
import { slugify } from "../../lib/utils";

export class ServiceService {
  async getAllServices(includeInactive = false) {
    return serviceRepository.findAll(includeInactive);
  }

  async getServiceById(id: string) {
    return serviceRepository.findById(id);
  }

  async getServiceBySlug(slug: string) {
    return serviceRepository.findBySlug(slug);
  }

  async createService(data: ServiceInput) {
    const slug = data.slug || slugify(data.name);
    
    // Check if slug already exists
    const existing = await serviceRepository.findBySlug(slug);
    if (existing) {
      throw new Error("A service with this name already exists.");
    }

    return serviceRepository.create({
      ...data,
      slug,
    });
  }

  async updateService(id: string, data: UpdateServiceInput) {
    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    }
    return serviceRepository.update(id, data);
  }

  async deleteService(id: string) {
    return serviceRepository.delete(id);
  }
}

export const serviceService = new ServiceService();
