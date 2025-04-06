// config/firebase-config.ts (Giả sử bạn đặt trong thư mục config)

import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging, isSupported } from "firebase/messaging"; // Thêm isSupported

const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyAkRtw9pS4rkI83lbDkW0LElZ0P1V1ZXyg",
    authDomain: "quan-ly-quan-cafe-pos.firebaseapp.com",
    projectId: "quan-ly-quan-cafe-pos",
    storageBucket: "quan-ly-quan-cafe-pos.appspot.com",
    messagingSenderId: "304063916764",
    appId: "1:304063916764:web:6e94c87c2bc8ae686a4b5e",
    measurementId: "G-B5D8E3C33F"
};

// Service account info for server-side operations
export const serviceAccount = {
  "type": "service_account",
  "project_id": "quan-ly-quan-cafe-pos",
  "private_key_id": "f9ca71a23e9d8c8fe2a04df9d4d869c68759ff82",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4L2Uc9P7oxst9\nJr0v5OLZosgVPTmlh0G6lGYWWcH9LO5p/G9sOjy7fC7ONORoeJJyNlr0SJ2n8q7e\nsgizRW7OkrNBgwH8D5gX7h0hSSboPhqy4E147NakM4LVeZinnK56YhDnM4z3TgHs\nYsLwPK1cMhz2019/uU5A9PEN47JMx4nEhXJ50AxIRAoFVug1RL7JPQoKj2Ib/0qr\nMHu5thxdf8Y/gdAJyiJGdk8o0lHIrRsB2OxSEQUHe1jAIVnyzfRx2tyxRwttrbPJ\n3t8fb7Tv+XKTvRhBF+H4G2X2d3AlSe/6IybJ+BvVHDF7E7ZPsaoKnYZYMPl75C26\nTotXdFntAgMBAAECggEADHVQ51EaDJg6a5F10q9ueblKmTHY5vL7wEP+lhdFqXCY\ngszrTicv9Eri0US0yMKTvfZ3wgDHFd+y3NzZfPjJaonJPA6Wu9w5KzCKbLXe6W7J\nTbKhguMFj2SYPlojzX3qCQdTlzPpM9F6t1N51e1LbkpJzmyUj9Yyrm7y/tUZOnCs\n8gLTQyQYBG4bWB8H4C00FiiEzVnEU/mdymfThazZ8Y5lRH9mH+diNLcc3k4o6H2M\nLfZgvFBOz2jSE/UZjqo0zcW/GslNm4QESONvxUeMRMcoo11Xj0wwjukLnhBgo07H\nG2Pe+XrxASA49UBH5i7zx886cA+GK182PtgoTlZwoQKBgQDuEJcDR+3imKrXobge\nKmuhjgCQwRqtOAVhDO+ePubAWBC20+/9ANJL/fILRKFzeaAsq+KBZKfcaTJL2vQe\nM0RN3XeStg+eeyuymkDnaHm9G01z0wsxHTPPqz8UFUw/og2Ko6GQmAY+5wX41ZV6\nmQdMcRZFAQIAw2xiftTR7DtB4QKBgQDGD6kyIZeFj0VHuWGQpDyRdL1DTaEOyInl\ndXwikowzAAnoP3kNYOa8nNKUJiilXlK0/VtMyQ4FuFZfPqtBy/BNgbK09MI4CO5/\nx22wctdKYTNWK4wxHA+fhsDs81/nRTjqokyb7PycM/wQvi1NfPQCIND7jXENi54e\nVzSvc9UxjQKBgFoYCS6CsDJLGIyWdTllUGpJdUlS6yeWxeJepOg8YdN1AI5QUshq\n4StFJa7CAF/VLZr6SbQyRZySayht6mjrefQF1lS9ddfCQV1MJzfsP/YjOQKWYevq\nY0s6QZr2HG8QgxNurZwtDGANyiLLodBNzYdOXOEsanejfYcg/KWdQyfBAoGBAIGa\nm+f/DUzLjNU7XLmujyfLkVGqSbsHxRyOvXVOGkoBO3prloYHo9VGdZGWSsCzsUFY\nDNd5NSDPGE3pD13V2uCM/2jkRPcv+QlKcd+ltnWol1RK2MkGCL8mCbbEJzyKEo2P\nOLxL3p1Ecyxtle1/15hQ6w/A5XqsowJNpF8vWBG9AoGAc+XP0diMKcejjbMIXTnN\nrNGrHhn9t5dVKFZW+fJ87/ij7BMxTbzSIPbi7G1uHIJtrq0g4AjmJeIezx+g1mD+\n7hOclO6fKxVCElj6QH1DjSFIFTeGSXVdLOLBReQe2DP/L65jW1zlPCYphtCHo5Kp\nGkrnrhjDPobZABtwjpzzRXA=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@quan-ly-quan-cafe-pos.iam.gserviceaccount.com",
  "client_id": "107565467412504220416",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40quan-ly-quan-cafe-pos.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

let firebaseApp: FirebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApps()[0];
}

let messagingInstance: Messaging | null = null;

// Hàm helper để lấy messaging instance một cách an toàn phía client
export const getClientMessaging = async (): Promise<Messaging | null> => {
    // Chỉ chạy ở phía client và kiểm tra hỗ trợ
    if (typeof window !== 'undefined' && await isSupported()) {
        if (!messagingInstance) { // Chỉ khởi tạo một lần
            try {
                messagingInstance = getMessaging(firebaseApp);
            } catch (error) {
                console.error("Error initializing Firebase Messaging:", error);
                messagingInstance = null;
            }
        }
        return messagingInstance;
    }
    console.log("Firebase Messaging is not supported in this environment.");
    return null;
};

// Vẫn export các hàm gốc và firebaseApp nếu cần ở nơi khác
export { firebaseApp, getToken, onMessage };