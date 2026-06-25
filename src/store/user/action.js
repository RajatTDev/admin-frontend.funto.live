import axios from "axios";
import { Toast } from "../../util/Toast";
import { apiInstanceFetch } from "../../util/api";
import {
  BLOCK_UNBLOCK_SWITCH,
  EDIT_COIN,
  GET_HISTORY,
  GET_USER,
} from "./types";

export const getUser =
  (start, limit, searchValue, sDate, eDate, diamond, rcoin) => (dispatch) => {
    apiInstanceFetch
      .get(
        `user/getUsers?start=${start}&limit=${limit}&search=${searchValue}&startDate=${sDate}&endDate=${eDate}` +
          (diamond ? `&diamond=${diamond}` : "") +
          (rcoin ? `&rcoin=${rcoin}` : "")
      )
      .then((res) => {
        if (res.status) {
          let male, female;
          if (res.maleFemale) {
            res.maleFemale.map((data) => {
              if (data._id === "female") return (female = data.gender);
              if (data._id === "male") return (male = data.gender);
            });
          }
          dispatch({
            type: GET_USER,
            payload: {
              user: res.user,
              activeUser: res.activeUser,
              total: res.total,
              male: male,
              female: female,
            },
          });
        } else {
          Toast("error", res.message);
        }
      })
      .catch((error) => Toast("error", error.message));
  };

export const handleBlockUnblockSwitch = (userId) => (dispatch) => {
  axios
    .patch(`user/blockUnblock/${userId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: BLOCK_UNBLOCK_SWITCH, payload: res.data.user });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const userHistory = (data) => (dispatch) => {
  axios
    .post(`history`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_HISTORY, payload: res.data });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const editCoin = (data) => (dispatch) => {
  axios
    .post(`/user/addLessCoin`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: EDIT_COIN,
          payload: { data: res.data.user, id: data.userId },
        });
        Toast("success", "Update Successful!!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
