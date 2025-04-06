import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, isSupported, Messaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
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

const getClientMessaging = async (): Promise<Messaging | null> => {
    const supported = typeof window !== 'undefined' && await isSupported();
    if (supported) {
        if (!messagingInstance) { 
            try {
                messagingInstance = getMessaging(firebaseApp);
            } catch (error) {
                console.error("Error initializing Firebase Messaging in client:", error);
                messagingInstance = null;
            }
        }
        return messagingInstance;
    }
    return null;
};

export const requestPermission = async (): Promise<string | null> => {
    try {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            console.log("Notifications not supported in this environment.");
            return null;
        }

        const messaging = await getClientMessaging();

        if (!messaging) {
            console.error("Firebase Messaging could not be initialized or is not supported.");
            return null;
        }

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");

            const vapidKey = "BPGn-zEQWbfOIEhw-Yynog0nKlXG9JH35t6cy6mDMQFjiWxzChafLZCvbwGyiJJ1wgOvEuK7-QdUg5DDts7p4js";
            if (!vapidKey) {
                console.error("VAPID key is missing.");
                return null; 
            }

            const token = await getToken(messaging, { vapidKey: vapidKey });

            if (token) {
                console.log("FCM Token:", token);
                return token;
            } else {
                console.warn("Could not get FCM registration token.");
                return null;
            }
        } else {
            console.warn("User denied notification permission.");
            return null;
        }
    } catch (error) {
        console.error("Error requesting permission or getting FCM token:", error);
        return null;
    }
};

// Add function to subscribe to FCM messages
export const subscribeToMessages = async (callback: (payload: any) => void): Promise<(() => void) | null> => {
    try {
        const messaging = await getClientMessaging();
        
        if (!messaging) {
            console.error("Firebase Messaging not available");
            return null;
        }
        
        return onMessage(messaging, (payload) => {
            console.log('Message received:', payload);
            callback(payload);
        });
    } catch (error) {
        console.error("Error subscribing to messages:", error);
        return null;
    }
};

export { getClientMessaging };