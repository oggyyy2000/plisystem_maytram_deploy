import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Backdrop,
  FormControlLabel,
  Checkbox,
  Grid,
  ImageList,
  ImageListItem,
  Box,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

import CloseIcon from "@mui/icons-material/Close";
import CropFreeIcon from "@mui/icons-material/CropFree";
import EditIcon from "@mui/icons-material/Edit";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import "./css/MainFlightDialogAfterFly.css";
import EditImageInfoDialog from "../../components/CommonDialog/EditImageInfoDialog";

const errorLabel = [
  "binhthuong",
  "cachdientt-vobat",
  "cachdienslc-rachtan",
  "daydien-tuasoi",
  "macdivat",
  "mongcot-satlo",
  "troita",
];

const imagePerRow = 6;

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MainFlightDialogAfterFly = ({
  flightComplete,
  getMissionAndScheduleId,
  docNo,
  typeTicket,
}) => {
  console.log("getMissionAndScheduleId: ", getMissionAndScheduleId)
  const [openModalAfterFly, setOpenModalAfterFly] = useState(false);
  const [errorImageBoxChecked, setErrorImageBoxChecked] = useState(false);
  const [imageNewLabels, setImageNewLabels] = useState([]);
  const [imgList2, setImgList2] = useState({});
  const [openZoomingImg, setOpenZoomingImg] = useState("");
  const [editLabelSelectedValue, setEditLabelSelectedValue] = useState([]);
  const [openEditLabel, setOpenEditLabel] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);

  //check variable change
  const [change, setChange] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hadSubmittedError, setHadSubmittedError] = useState(false);
  const [labelChanged, setLabelChanged] = useState(false);

  // pagination
  const [nextImg, setNextImg] = useState({});
  // console.log(nextImg.VT5.loaded);

  // split tab
  const [tab, setTab] = useState(0);
  // const [currentTab, setCurrentTab] = useState(0);

  const urlPostFlightData = process.env.REACT_APP_API_URL + "flightdatas/";
  const urlGetData =
    process.env.REACT_APP_API_URL +
    "supervisiondetails/?mission_id=" +
    getMissionAndScheduleId.mission_id +
    `&img_state=${errorImageBoxChecked === true ? "defect" : "all"}`;
  console.log(urlGetData);
  const urlPostNewImageLabel =
    process.env.REACT_APP_API_URL + "supervisiondetails/";

  console.log(getMissionAndScheduleId);
  useEffect(() => {
    setOpenModalAfterFly(flightComplete);
  }, [flightComplete]);

  useEffect(() => {
    setLabelChanged(false);
    setChange(false);
    setImageNewLabels([]);
    setHadSubmittedError(false);

    if (openModalAfterFly) {
      axios
        .get(urlGetData)
        .then((res) => {
          console.log("data:", res.data);
          setImgList2(res.data);
          // setNextImg(
          //   Object.keys(res.data).reduce((acc, galleryKey) => {
          //     acc[galleryKey] = { loaded: imagePerRow };
          //     return acc;
          //   }, {})
          // );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    change,
    hadSubmittedError,
    errorImageBoxChecked,
    urlGetData,
    openModalAfterFly,
    labelChanged
  ]);

  useEffect(() => {
    setTab(0);
  }, [errorImageBoxChecked]);

  // --------- Ham de xu ly click input va label ---------
  const handleLabelClick = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleInputClick = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    console.log(updatedList);
    setChecked(updatedList);
  };

  // --------- Ham de loc chi anh bat thuong  ---------
  const handleErrorImageBoxChecked = (e, index) => {
    setErrorImageBoxChecked(e.target.checked);
    // setCurrentTab(index);
  };

  // --------- Ham de submit tat ca cac anh nguoi dung chon --------
  const handleSubmitErrorImage = () => {
    setHadSubmittedError(false);

    const formData = new FormData();
    formData.append("schedule_id", getMissionAndScheduleId.schedule_id);
    formData.append("list_imageid", selectedLabels);

    axios
      .post(urlPostFlightData, formData)
      .then((response) => {
        if (response.status === 200) {
          alert("Tất cả ảnh đã chọn đã được gửi đi !");
          setHadSubmittedError(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // ------------ Zooming Dialog ------------

  const zoomingDialog = (info) => {
    return (
      <>
        <Button
          className="modal-afterfly__zoom-btn"
          variant="contained"
          onClick={() => setOpenZoomingImg(info.image_path)}
        >
          <CropFreeIcon />
        </Button>

        <Dialog
          open={openZoomingImg === info.image_path ? true : false}
          onClose={() => setOpenZoomingImg(false)}
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          fullWidth
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <img
            src={process.env.REACT_APP_IMG + info.image_path}
            srcSet={process.env.REACT_APP_IMG + info.image_path}
            alt={info.img_path}
            loading="lazy"
            width={"100%"}
            height={"100%"}
          />
        </Dialog>
      </>
    );
  };

  // ------------- Edit Label Dialog---------------

  // const handleCheckboxChooseNewLabel = (e) => {
  //   const { value, checked } = e.target;

  //   if (checked) {
  //     setImageNewLabels([...imageNewLabels, value]);
  //   } else {
  //     setImageNewLabels(imageNewLabels.filter((label) => label !== value));
  //   }

  //   if (value === "binhthuong" || imageNewLabels === "binhthuong") {
  //     if (editLabelSelectedValue.includes(value)) {
  //       setImageNewLabels([]);
  //       setEditLabelSelectedValue([]);
  //     } else {
  //       setImageNewLabels([value]);
  //       setEditLabelSelectedValue([value]);
  //     }
  //   } else {
  //     setEditLabelSelectedValue([value]);
  //   }

  //   console.log(imageNewLabels);
  // };

  // const isDisabled = (value) => {
  //   return (
  //     (editLabelSelectedValue.includes("binhthuong") ||
  //       imageNewLabels.includes("binhthuong")) &&
  //     value !== "binhthuong"
  //   );
  // };

  // const handleSubmitEditLabel = (imageLink) => {
  //   const imageLabel = {
  //     img_path: imageLink,
  //     new_label: imageNewLabels.join("_"),
  //   };

  //   axios
  //     .post(urlPostNewImageLabel, imageLabel)
  //     .then((response) => {
  //       console.log(response);
  //       if (response.data === "Change Success") {
  //         alert("Thay đổi nhãn thành công!");
  //         setChange(true);
  //         setOpenEditLabel(false);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  // const editLabelDialog = (info) => {
  //   return (
  //     <>
  //       <Button
  //         className="modal-afterfly__edit-btn"
  //         variant="contained"
  //         onClick={() => {
  //           setOpenEditLabel(info.img_path);
  //           setImageNewLabels([...info.label.split("_")]);
  //         }}
  //         disabled={info.sent_check === 1}
  //       >
  //         <EditIcon />
  //       </Button>
  //       <Dialog
  //         fullWidth
  //         maxWidth="xs"
  //         open={openEditLabel === info.img_path ? true : false}
  //         slots={{ backdrop: Backdrop }}
  //         slotProps={{
  //           backdrop: {
  //             sx: {
  //               backgroundColor: "rgba(0, 0, 0, 0.5)",
  //             },
  //           },
  //         }}
  //       >
  //         <DialogTitle>Cập nhật nhãn bất thường</DialogTitle>
  //         <DialogContent dividers>
  //           {errorLabel.map((label) => (
  //             <label key={label} style={{ fontSize: "20px" }}>
  //               <input
  //                 type="checkbox"
  //                 value={label}
  //                 checked={imageNewLabels.includes(label)}
  //                 onChange={(e) => handleCheckboxChooseNewLabel(e)}
  //                 disabled={isDisabled(label)}
  //               />
  //               {label} <br />
  //             </label>
  //           ))}
  //         </DialogContent>
  //         <DialogActions>
  //           <Button autoFocus onClick={() => setOpenEditLabel(false)}>
  //             Hủy
  //           </Button>
  //           <Button onClick={() => handleSubmitEditLabel(info.img_path)}>
  //             Xác nhận
  //           </Button>
  //         </DialogActions>
  //       </Dialog>
  //     </>
  //   );
  // };

  // --------- Ham de xu ly pagination --------
  // const handleLoadMore = (vt) => {
  //   setNextImg((prevNextImg) => ({
  //     ...prevNextImg,
  //     [vt]: { loaded: prevNextImg[vt].loaded + imagePerRow },
  //   }));
  // };

  // --------- Ham xu ly chia tab ---------
  const handleChangeTabs = (event, newValue) => {
    console.log(newValue);
    setTab(newValue);
  };

  // ------------- Render list error images Dialog ---------------
  const renderImageList = () => {
    return Object.keys(imgList2).map((vt, index) => {
      return (
        <>
          {tab === index && (
            <CustomTabPanel value={tab} index={index}>
              <ImageList
                sx={{
                  position: "relative",
                  overflowY: "hidden",
                }}
                cols={3}
              >
                {imgList2[vt]
                  // ?.slice(0, nextImg[vt].loaded)
                  ?.map((info, index) => {
                    return (
                      <>
                        <ImageListItem key={index}>
                          <div className="modal-afterfly__img-list-items-header">
                            <TextField
                              id="outlined-multiline-flexible"
                              label="Tình trạng"
                              value={info.image_title}
                              multiline // multiline của TextField MUI đang lỗi
                              maxRows={1}
                              style={{ height: "70%", marginTop: "7px" }}
                              disabled
                            />

                            <div>
                              {/* Zoom Dialog */}
                              {zoomingDialog(info)}

                              {/* Edit label Dialog */}
                              <EditImageInfoDialog
                                info={info}
                                setLabelChanged={setLabelChanged}
                                type_ticket={typeTicket}
                              />
                            </div>
                          </div>

                          <label
                            for={`choose-img-${info.image_id}`}
                            className={`modal-afterfly__img-list-items-label ${
                              info.sent_status === "sent" ? "hadsubmitted" : ""
                            } ${
                              selectedLabels.includes(info.image_id) ||
                              info.sent_status === "sent"
                                ? "choosed"
                                : ""
                            }`}
                            onClick={() => handleLabelClick(info.image_id)}
                          >
                            <img
                              src={process.env.REACT_APP_IMG + info.image_path}
                              srcSet={
                                process.env.REACT_APP_IMG + info.image_path
                              }
                              alt={info.image_label}
                              loading="lazy"
                              width={"100%"}
                              height={"100%"}
                            />
                          </label>

                          {selectedLabels.includes(info.image_id) &&
                          info.sent_status === "not_sent" ? (
                            <div className="checkmark-hadchoosed"></div>
                          ) : (
                            <></>
                          )}

                          {info.sent_status === "sent" ? (
                            <MarkEmailReadIcon
                              className="icon-hadsent"
                              color="info"
                              fontSize="large"
                            />
                          ) : (
                            <></>
                          )}
                        </ImageListItem>

                        <input
                          id={`choose-img-${info.image_path}`}
                          type="checkbox"
                          value={info.image_path}
                          style={{
                            display: "none",
                          }}
                          onChange={handleInputClick}
                        />
                      </>
                    );
                  })}
              </ImageList>
            </CustomTabPanel>
          )}
        </>
      );
    });
  };

  return (
    <Dialog fullWidth maxWidth={"xl"} open={openModalAfterFly}>
      <DialogTitle className="modal-afterfly__header">
        <h2 style={{ textAlign: "center" }}>KẾT QUẢ KIỂM TRA</h2>
        <Button
          className="modal-afterfly__close-btn"
          color="error"
          variant="contained"
          onClick={() => setOpenModalAfterFly(false)}
        >
          <CloseIcon fontSize="small" />
        </Button>
      </DialogTitle>
      <DialogContent className="modal-afterfly__body">
        <Grid item className="modal-afterfly__img-list" xs={12}>
          {getMissionAndScheduleId !== undefined ? (
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tab}
                onChange={handleChangeTabs}
                aria-label="basic tabs example"
              >
                {Object.keys(imgList2).map((vt, index) => (
                  <Tab key={index} label={vt} {...a11yProps(index)} />
                ))}

                <div className="modal-afterfly__btn-group">
                  <FormControlLabel
                    className="modal-afterfly__form-label"
                    control={<Checkbox />}
                    label="Ảnh bất thường"
                    onChange={(e) => handleErrorImageBoxChecked(e)}
                  />
                </div>
              </Tabs>
            </Box>
          ) : (
            <></>
          )}
          {getMissionAndScheduleId !== "" && renderImageList()}
        </Grid>
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "center",
          border: "1px solid black",
        }}
      >
        <Button
          className="modal-afterfly__submit-btn"
          variant="outlined"
          onClick={handleSubmitErrorImage}
        >
          GỬI
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainFlightDialogAfterFly;
