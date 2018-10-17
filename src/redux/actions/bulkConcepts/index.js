import { notify } from 'react-notify-toast';
import instance from '../../../config/axiosConfig';
import { isSuccess, isErrored, isFetching } from '../globalActionCreators';
import { FETCH_CIEL_CONCEPTS, ADD_EXISTING_BULK_CONCEPTS } from '../types';

const fetchCielConcepts = () => async (dispatch) => {
  dispatch(isFetching(true));
  const url = 'orgs/CIEL/sources/CIEL/concepts/?limit=0';
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_CIEL_CONCEPTS));
    dispatch(isFetching(false));
  } catch (error) {
    dispatch(isErrored(error.response.data, FETCH_CIEL_CONCEPTS));
    dispatch(isFetching(false));
  }
};
export default fetchCielConcepts;

export const addExistingBulkConcepts = conceptData => async (dispatch) => {
  const { url, data } = conceptData;
  try {
    const payload = await instance.put(url, data);
    dispatch(isSuccess(payload.data, ADD_EXISTING_BULK_CONCEPTS));
    const existing = payload.data.filter(pay => pay.added === false);
    if (existing.length > 0) {
      notify.show(`Only ${payload.data.length - existing.length} of ${payload.data.length} concept(s) were added. Skipped ${existing.length} already added`, 'error', 3000);
    } else {
      notify.show(`${payload.data.length - existing.length} Concept(s) Added`, 'success', 3000);
    }
  } catch (error) {
    notify.show(error, 'error', 3000);
  }
};

export const addDictionaryReference = (conceptUrl, ownerUrl, dictionaryId) =>
  async (dispatch) => {
    const url = `${ownerUrl}collections/${dictionaryId}/references/`;
    let payload;
    try {
      const conceptsResponse = await instance.get(conceptUrl);
      const references = {
        data: { expressions: [...conceptsResponse.data.map(concept => concept.url)] },
      };
      payload = await instance.put(url, references);
    } catch (error) {
      return notify.show('There was an error in referencing concepts in the new dictionary', 'error', 3000);
    }
    return dispatch(isSuccess(payload, ADD_EXISTING_BULK_CONCEPTS));
  };

