import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class MenuOption extends React.Component {
  handleFocusOption = event => {
    const { index } = event.currentTarget.dataset;
    this.props.onMouseOver(index);
  }

  handleClickOption = event => {
    event.preventDefault(); // so that we can avoid triggering onBlur of inputBox
    this.props.onMouseDown();
  }

  render() {
    const { props } = this;

    return (
      <div
        className={cx('userOption', { 'is-focused': props.optionIndex === props.focusedOptionIndex })}
        onMouseDown={this.handleClickOption}
        onMouseOver={this.handleFocusOption}
        data-index={props.optionIndex}
      >
        {props.children}
      </div>
    );
  }
}

MenuOption.propTypes = {
  focusedOptionIndex: PropTypes.number,
  optionIndex: PropTypes.number,
  onMouseOver: PropTypes.func,
  onMouseDown: PropTypes.func,
  children: PropTypes.element,
};

export default MenuOption;