import React, { useEffect, useState } from "react";
import { Pagination, Button } from "@nextui-org/react";

interface PaginationButtonsProps {
  page: number;
  setPage: React.Dispatch<number>;
  maxPage: number;
  data: any[];
}

export default function PaginationButtons({ page, setPage, maxPage, data }: PaginationButtonsProps) {
  const handleChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (maxPage === 0 || page > maxPage) {
      setPage(maxPage);
    }
  }, [page, maxPage, setPage]);

  return (
    <div className="flex flex-col items-center justify-between ">
      <p className="text-small text-default-500">Página seleccionada: {page}</p>
      
      <Pagination
       loop showControls
       color="success"
       initialPage={1}
        total={maxPage}
        page={page}
        onChange={handleChange}
        className="overflow-hidden"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="flat"
          color="secondary"
          disabled={page === 1}
          onPress={() => setPage((prevPage: number) => prevPage - 1)}
        >
          Anterior
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="secondary"
          disabled={page === maxPage}
          onPress={() => setPage((prevPage: number) => prevPage + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}


// export default function App() {
//   const [currentPage, setCurrentPage] = React.useState(1);

//   return (
//     <div className="flex flex-col gap-5 overflow-hidden">
//       <p className="text-small text-default-500">Pagina Seleccionada: {currentPage}</p>
//       <Pagination
//         total={10}
//         color="secondary"
//         page={currentPage}
//         onChange={setCurrentPage}
//       />
//       <PaginationButtons page={currentPage} setPage={setCurrentPage} />
//     </div>
//   );
// }


//import React, { useEffect } from "react";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";

// interface PaginationButtonsProps {
//   page: number;
//   setPage: React.Dispatch<number>;
//   maxPage: number;
//   data: any; // Ajusta este tipo según el tipo real de tus datos
// }

// export default function PaginationButtons({ page, setPage, maxPage, data }: PaginationButtonsProps) {
//   const handleChange = (event: React.ChangeEvent<any>, value: number) => {
//     setPage(value);
//   };

//   useEffect(() => {
//     setPage(1);
//   }, [data, setPage]);

//   return (
//     <div className="flex items-center justify-center space-x-2">
//       <Stack spacing={2}>
//         <Pagination
//           count={maxPage}
//           onChange={handleChange}
//           defaultPage={1}
//           page={page}
//           showFirstButton
//           showLastButton
//           className="text-cyan"
//           variant="outlined" color="primary"
//         />
//       </Stack>
//     </div>
//   );
// }
