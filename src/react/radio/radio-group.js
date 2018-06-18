import React from 'react';
import PropTypes from 'prop-types-annotated';
import classnames from 'classnames';

export class RadioGroup extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  };

  componentDidMount() {
    require('../../css/forms');
  }

  render() {
    const {name, children, onChange, className, ...others} = this.props;
    const radioProps = onChange ? {name, onChange} : {name};

    const renderedChildren = React.Children.map(children, child =>
      React.cloneElement(child, radioProps));

    const props = {
      ...others,
      className: classnames('pui-radio-group', className)
    };

    return <div {...props} >{renderedChildren}</div>;
  }
}
