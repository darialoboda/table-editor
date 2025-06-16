// // src/components/ModalMui.js
// import React from 'react';
// import { Modal, Box, Typography, IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2,
//   width: 400,
// };

// const ModalMui = ({ isOpen, onClose, title, children }) => {
//   return (
//     <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-title">
//       <Box sx={style}>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <Typography id="modal-title" variant="h6" component="h2">
//             {title}
//           </Typography>
//           <IconButton onClick={onClose} size="small">
//             <CloseIcon />
//           </IconButton>
//         </Box>
//         {children}
//       </Box>
//     </Modal>
//   );
// };

// export default ModalMui;
