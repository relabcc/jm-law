import React, { PureComponent, createElement } from 'react';

class YearByYear extends PureComponent {
  render() {
    console.log(this.props)
    return (
      <div>

      </div>
    );
  }
}

export default ({ year, ...props }) => createElement(YearByYear, props);
