declare global {
  namespace App {
    interface Locals {
      isAdmin: boolean;
    }

    interface PageData {
      viewer?: {
        isAdmin: boolean;
      };
    }
  }
}

export {};
