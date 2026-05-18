import { userRepository } from "../repositories/user.repository";
import { UpdateProfileSchema, UpdateProfileInput } from "../types/user.schema";

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    // Validate input
    const validated = UpdateProfileSchema.parse(data);

    // Only update fields that were provided
    const updateData: UpdateProfileInput = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.email !== undefined) updateData.email = validated.email;
    if (validated.phone !== undefined) updateData.phone = validated.phone;

    return userRepository.updateProfile(userId, updateData);
  }

  async deleteAccount(userId: string) {
    // Verify user exists
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    return userRepository.deleteUser(userId);
  }
}

export const userService = new UserService();
