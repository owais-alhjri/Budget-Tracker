import * as yup from 'yup';
export const UserSchemaValidation = yup.object().shape({
    name:yup.string().required("Name is Required"),
    email:yup.string().email("Not valid Email Format").required("Email is Required"),
    password:yup.string().min(4).max(20).required("Password is Required"),
    confirmPassword:yup.string().oneOf([yup.ref("password")],"Password Don't match").required("Confirm Password is Required"),
});