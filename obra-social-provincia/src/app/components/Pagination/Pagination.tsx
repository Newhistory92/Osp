import React, { useEffect } from "react";
import { Pagination, Button } from "@nextui-org/react";
import { PaginationButtonsProps } from "@/app/interfaces/interfaces";

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
