import PropTypes from 'prop-types';
import styled from 'styled-components';
import { background } from 'styled-system';

import Box from './Box';

const BackgroundImage = styled(Box)`
  ${background}
  background-image: url(${({ src }) => src});
  background-repeat: no-repeat;
  ${(props) => props.height ? '' : `padding-top: ${props.ratio * 100}%;`}
`;

BackgroundImage.propTypes = {
  src: PropTypes.string,
  backgroundSize: PropTypes.string,
  backgroundPosition: PropTypes.string,
};

BackgroundImage.defaultProps = {
  position: 'relative',
  ratio: 1,
  backgroundSize: 'cover',
  backgroundPosition: '50% 50%',
};

BackgroundImage.displayName = 'BackgroundImage';

export default BackgroundImage;
