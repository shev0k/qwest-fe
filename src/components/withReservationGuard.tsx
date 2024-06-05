import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withReservationGuard = (WrappedComponent: React.ComponentType) => {
  const ComponentWithReservationGuard = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const reservationDetails = localStorage.getItem('reservationDetails');
      if (!reservationDetails) {
        router.push('/'); // Redirect to home page if no reservation
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  ComponentWithReservationGuard.displayName = `WithReservationGuard(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithReservationGuard;
};

export default withReservationGuard;
