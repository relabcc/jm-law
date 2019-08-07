import styled from 'styled-components';
import { space, layout, opacity } from 'styled-system';
import tag from 'clean-tag';

import blacklist from './utils/blacklist';

const Image = styled(tag.img)`
  ${space}
  ${layout}
  ${opacity}
`;

Image.defaultProps = {
  blacklist,
  width: 1,
};

Image.displayName = 'Image';

export default Image;
