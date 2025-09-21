import React from 'react';
// import { useRouter } from 'next/router';
import { TOTPSetup,  } from '@/components/auth/TOTPVerification';

export default function VerifyToTpPage() {
    // const router = useRouter();
    // const { email } = router.query;

    // const handleResend = async () => {
    //     try {
    //         const raw = sessionStorage.getItem("pendingAuth");
    //         if (raw) {
    //             console.log(JSON.parse(raw));
    //         }
    //         console.log('Resending OTP...');
    //     } catch (error) {
    //         console.error('Failed to resend OTP:', error);
    //     }
    // };

    return (
        // Trong MFA Settings Page
<TOTPSetup
  onSuccess={() => {
    // TOTP setup thành công
    //router.push('/settings/mfa?success=totp-enabled');
  }}
  onCancel={() => {
    // User cancel setup
    //router.back();
  }}
/>
    );
}