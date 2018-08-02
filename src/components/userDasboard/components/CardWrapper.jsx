import React from 'react';
import PropTypes from 'prop-types';
import DictionaryCard from '../../dashboard/components/dictionary/DictionaryCard';
import Loader from '../../Loader';

const CardWrapper = (props) => {
  const { dictionaries, fetching, org } = props;
  if (fetching && !org) {
    return (
      <div className="text-center mt-3">
        <Loader />
      </div>
    );
  }
  if (dictionaries.length >= 1 && !org) {
    return (
      <div className="row justify-content-center">
        {dictionaries.map(dictionary => (
          <DictionaryCard dictionary={dictionary} key={dictionary.uuid} {...props} />
        ))}
      </div>
    );
  }
  return (
    <div className="text-center mt-3 p-10">
      {!org && <h6 className="p-20">No dictionaries found</h6>}
    </div>
  );
};

CardWrapper.propTypes = {
  fetching: PropTypes.bool.isRequired,
  org: PropTypes.bool,
  dictionaries: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};

CardWrapper.defaultProps = {
  org: false,
};
export default CardWrapper;
