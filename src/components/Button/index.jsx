import PropTypes from 'prop-types';
import './index.scss';

const CustomButton = ({ label }) => {
    return (
        <button className='custom-btn'>{label}</button>
    );
};

CustomButton.prototypes = {
    label: PropTypes.any
}

export {CustomButton}