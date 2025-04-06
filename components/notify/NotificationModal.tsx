'use client';

import React from 'react';
import { useNotifications, Notification } from '@/context/NotificationContext';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'; 
import IconButton from '@mui/material/IconButton'; 

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
    const { notifications, clearNotifications, markAsRead } = useNotifications();

    if (!isOpen) {
        return null;
    }

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); 
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-out">
            <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-lg shadow-xl relative max-h-[85vh] flex flex-col transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800">Thông báo</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none text-3xl leading-none p-1 -m-1 rounded-full hover:bg-gray-100"
                        aria-label="Đóng"
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body overflow-y-auto flex-grow mb-4 pr-2 -mr-2"> 
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">Không có thông báo nào.</p>
                    ) : (
                        <ul className="space-y-3"> 
                            {notifications.map((notif: Notification) => (
                                <li
                                    key={notif.id}
                                    className={`border rounded-md p-3 transition-colors duration-200 ${
                                        notif.read ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-gray-300 shadow-sm'
                                    } flex items-start space-x-3`}
                                >
                                    <div className="flex-shrink-0 pt-1">
                                        <IconButton
                                            size="small"
                                            onClick={() => markAsRead(notif.id)} 
                                            disabled={notif.read} 
                                            aria-label={notif.read ? "Đã đọc" : "Đánh dấu đã đọc"}
                                            sx={{ color: notif.read ? 'success.main' : 'action.active' }} 
                                        >
                                            {notif.read ? <CheckCircleOutlineIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                                        </IconButton>
                                    </div>
                                    <div className="flex-grow">
                                        <p className={`font-medium ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>{notif.title}</p>
                                        <p className={`text-sm mt-1 ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>{notif.body}</p>
                                        <p className="text-xs text-gray-400 mt-2">{formatTimestamp(notif.timestamp)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-gray-200 flex-shrink-0 text-right">
                        <button
                            onClick={clearNotifications}
                            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeInScale {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in-scale {
                        animation-name: fadeInScale;
                        animation-duration: 0.3s;
                        animation-fill-mode: forwards;
                    }
                `
            }} />
        </div>
    );
};

export default NotificationModal;