import { RestaurantSettings } from "../entities/RestaurantSettings";

export interface IRestaurantSettingsRepository {
  get(): Promise<RestaurantSettings>; // singleton
  update(settings: RestaurantSettings): Promise<RestaurantSettings>;
}
