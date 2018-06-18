import React from 'react';
import PropTypes from 'prop-types-annotated';
import {mergeProps} from '../helpers';
import classnames from 'classnames';

export class Grid extends React.PureComponent {
  static propTypes = {
    gutter: PropTypes.bool
  };

  static defaultProps = {
    gutter: true
  };

  componentDidMount() {
    require('../../css/flex-grids');
  }

  render() {
    const {gutter, ...props} = this.props;
    const newProps = mergeProps(props, {className: classnames('grid', gutter ? '' : 'grid-nogutter')});
    return <div {...newProps}/>;
  }
}

export class FlexCol extends React.Component {
  static propTypes = {
    col: PropTypes.number,
    fixed: PropTypes.bool,
    grow: PropTypes.number,
    alignment: PropTypes.oneOf(['top', 'middle', 'bottom']),
    contentAlignment: PropTypes.oneOf(['top', 'middle', 'bottom']),
    breakpoint: PropTypes.oneOf(['sm', 'md', 'lg'])
  };

  componentDidMount() {
    require('../../css/flex-grids');
  }

  render() {
    const {col, fixed, grow, alignment, contentAlignment, breakpoint, ...other} = this.props;

    const colClassName = classnames({
      [`col-${col}`]: col
    });

    const fixedClassName = classnames({
      'col-fixed': fixed
    });

    const growClassName = classnames({
      [`col-grow-${grow}`]: grow
    });

    const alignmentClassName = classnames({
      [`col-align-${alignment}`]: alignment
    });

    const contentAlignmentClassName = classnames({
      [`col-${contentAlignment}`]: contentAlignment
    });

    const breakpointClassName = classnames({
      [`col-${breakpoint}`]: breakpoint
    });

    const className = classnames('col', colClassName, fixedClassName, growClassName, alignmentClassName,
      contentAlignmentClassName, breakpointClassName);

    const newProps = mergeProps(other, {className});
    return <div {...newProps}/>;
  }
};