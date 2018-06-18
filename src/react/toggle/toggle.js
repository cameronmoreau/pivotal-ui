import React from 'react';
import PropTypes from 'prop-types-annotated';
import uniqueid from 'lodash.uniqueid';
import classnames from 'classnames';
import {mergeProps} from '../helpers';

export class Toggle extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    type: PropTypes.oneOf(['checkbox'])
  };

  static defaultProps = {
    size: 'medium',
    type: 'checkbox'
  };

  componentDidMount() {
    require('../../css/toggle');
  }

  render() {
    const {children, id, size, className, ...others} = this.props;
    const toggleId = id || uniqueid('toggle');

    const inputProps = mergeProps(others, {
      className: 'toggle-switch pui-toggle-switch',
      id: toggleId,
      type: 'checkbox'
    });

    return (<div>
      <input {...inputProps}/>
      <label {...{htmlFor: toggleId, className: classnames(size, className)}}>{children}</label>
    </div>);
  }
}
