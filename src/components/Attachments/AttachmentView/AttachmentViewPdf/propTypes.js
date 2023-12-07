import {stylePropTypes} from '@styles';
import PropTypes from 'prop-types';
import * as AttachmentsPropTypes from '@components/Attachments/propTypes';

const attachmentViewPdfPropTypes = {
    /** File object maybe be instance of File or Object */
    file: AttachmentsPropTypes.attachmentFilePropType.isRequired,

    encryptedSourceUrl: PropTypes.string.isRequired,
    onToggleKeyboard: PropTypes.func.isRequired,
    onLoadComplete: PropTypes.func.isRequired,

    /** Additional style props */
    style: stylePropTypes,

    /** Styles for the error label */
    errorLabelStyles: stylePropTypes,
};

const attachmentViewPdfDefaultProps = {
    file: {
        name: '',
    },
    style: [],
    errorLabelStyles: [],
};

export {attachmentViewPdfPropTypes, attachmentViewPdfDefaultProps};
