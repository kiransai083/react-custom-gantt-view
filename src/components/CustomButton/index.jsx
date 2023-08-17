import './index.scss';

export const CustomButton = ({children, ...props}) => {
    return <button className="custom-btn" {...props}>{children}</button>
};