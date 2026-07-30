'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import LayoutDesktop from '@/components/templates/LayoutDesktop';
import NotificationDetailSection from '@/components/organisms/NotificationDetailSection';
import type { Notification } from '@/lib/api/types';
import { getServiceErrorMessage } from '@/services/httpService';
import { notificationService } from '@/services/notificationService';

export default function NotificationDetailPage() {
  const params = useParams<{ id: string }>();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    notificationService.getById(params.id)
      .then(setNotification)
      .catch((loadError: unknown) => {
        setError(getServiceErrorMessage(
          loadError,
          'Falha ao carregar a notificação.',
        ));
      })
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const handleToggleRead = async () => {
    if (!notification || isUpdating) return;

    setIsUpdating(true);
    setError('');
    try {
      const updatedNotification = await notificationService.toggleRead(
        notification.id,
      );
      setNotification(updatedNotification);
    } catch (updateError) {
      setError(getServiceErrorMessage(
        updateError,
        'Falha ao atualizar a notificação.',
      ));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <LayoutDesktop>
      <div className='p-4 md:p-8'>
        {isLoading && (
          <p className='text-gray-500'>Carregando notificação...</p>
        )}
        {error && (
          <p className='mb-4 rounded-lg bg-red-50 p-4 text-red-700'>{error}</p>
        )}
        {notification && (
          <NotificationDetailSection
            notification={notification}
            onMarkAsRead={handleToggleRead}
          />
        )}
      </div>
    </LayoutDesktop>
  );
}
