import 'dotenv/config'; 
import { ExpoConfig } from 'expo/config';

export default ({ config }: { config: ExpoConfig }): ExpoConfig => {
  return {
    ...config,
    extra: {
      apiUrl: process.env.REACT_PUBLIC_API_AUTH_URL,
      apiAdminUrl: process.env.REACT_PUBLIC_API_ADMIN_URL,
      cdnMediafileUrl: process.env.NEXT_PUBLIC_CDN_MEDIAFILE_URL,
      apiMediafileUrl: process.env.NEXT_PUBLIC_API_MEDIAFILE_URL,
      eas:{
        projectId: 'a2ada37d-dfba-4047-b375-ae6ec41c98f4'
      }
    },
  };
};