export const enum NODE_ENV {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}
export const isDev = process.env.NODE_ENV === NODE_ENV.DEVELOPMENT;
export const SERVER_ADDRESS = import.meta.env.BASE_URL;
