import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
    return <SignUp fallbackRedirectUrl={"/"} />;
};

export default SignUpPage;
