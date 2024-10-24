export const useGoogleAuth = () => {
  const redirect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API}/auth/google`;
  };
  return { redirect };
};
