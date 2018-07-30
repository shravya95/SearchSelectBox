import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const SEARCH_ICONS_URL = 'https://www.shareicon.net/download/2015/10/03/110917_search.ico';

class SearchInput extends PureComponent {
  onSearchQueryChange = event => {
    this.props.onChange(event.target.value);
  };

  renderClearIcon() {
    const { props } = this;
    return props.value && (
      <div onClick={props.clearText} className="crossIcon">x</div>
    );
  }

  render() {
    const { props } = this;
    return (
      <div className="searchInputContainer">
        <img className="searchIcon" src={SEARCH_ICONS_URL} />
        <input
          className="searchInput"
          onChange={this.onSearchQueryChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          type="text"
          id="search-users"
          placeholder='Search...'
          value={props.value}
          autoFocus={props.isFocused}
        />
        {this.renderClearIcon()}
      </div>
    );
  }
}

SearchInput.propTypes = {
  className: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  isFocused: PropTypes.bool,
  clearText: PropTypes.func,
  value: PropTypes.string,
};

export default SearchInput;