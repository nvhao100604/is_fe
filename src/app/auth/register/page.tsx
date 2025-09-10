import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    return <RegisterForm />;
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const token = context.req.cookies.accessToken;

//     if (token) {
//         return {
//             redirect: {
//                 destination: '/dashboard',
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {},
//     };
// };