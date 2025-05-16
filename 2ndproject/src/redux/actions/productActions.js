import {
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAIL,
} from "../constants/productConstants";
import axios from "axios";

export const searchProducts = (keyword) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST });
    console.log("Searching for:", keyword);

    // Sử dụng API endpoint thực tế của bạn
    const { data } = await axios.get(
      `http://localhost:5000/api/products/search?keyword=${keyword}`
    );
    console.log("Search results:", data);

    dispatch({
      type: SEARCH_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Search error:", error);
    dispatch({
      type: SEARCH_PRODUCTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
