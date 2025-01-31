import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";

export interface WebsiteConfigStore {
  title: string;
  subTitle: string;
  loginPageSubTitle: string;
  registerPageSubTitle: string;
  fetchWebsiteConfig: () => Promise<any>;
}

export interface WebsiteConfig {
  title: string;
  subTitle: string;
  loginPageSubTitle: string;
  registerPageSubTitle: string;
}
export interface WebsiteConfigData {
  websiteContent: WebsiteConfig;
}

import { Response } from "../api/common";
export type WebsiteConfigResponse = Response<WebsiteConfigData>;

export const useWebsiteConfigStore = create<WebsiteConfigStore>()(
  persist(
    (set, get) => ({
      title: "",
      subTitle: "",
      loginPageSubTitle: "",
      registerPageSubTitle: "",

      async fetchWebsiteConfig() {
        return fetch("/api/globalConfig/website", {
          method: "get",
        })
          .then((res) => res.json())
          .then((res: WebsiteConfigResponse) => {
            console.log("[GlobalConfig] got website config from server", res);
            const website = res.data.websiteContent;
            set(() => ({
              title: website.title,
              subTitle: website.subTitle,
              loginPageSubTitle: website.loginPageSubTitle,
              registerPageSubTitle: website.registerPageSubTitle,
            }));
            return res;
          })
          .catch(() => {
            console.error("[GlobalConfig] failed to fetch config");
          })
          .finally(() => {
            // fetchState = 2;
          });
      },
    }),
    {
      name: StoreKey.Chat,
      version: 2,
    },
  ),
);
