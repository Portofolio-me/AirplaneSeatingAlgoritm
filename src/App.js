import "./App.css";
import { useState } from "react";
import Swal from "sweetalert2";

function App() {
  const [inputSeat, setInputSeat] = useState([]);
  const [inputPassenger, setInputPassenger] = useState();
  const [seat, setSeat] = useState();
  const [remainingPassengers, setRemainingPassenger] = useState(0);

  function onChangeInputSeat(e) {
    e.preventDefault();
    setInputSeat([e.target.value]);
  }

  function onChangeInputPenumpang(e) {
    e.preventDefault();
    setInputPassenger(e.target.value);
  }

  function seatingAlgoritm2(input, inputPassenger) {
    const maxColumns = Math.max(...input.map((arr) => arr[1]));
    let seats = [];
    let reamining = inputPassenger;
    let nextSeatNumber = 1;

    for (let columnIndex = 0; columnIndex < maxColumns; columnIndex++) {
      let indexingPerRows = [];

      input.forEach((arr) => {
        const row = arr[0];
        let col = arr[1];

        for (let i = 0; i < row; i++) {
          if (col - columnIndex > 0) {
            indexingPerRows.push("seat");
          } else {
            indexingPerRows.push("empty");
          }
        }
        indexingPerRows.push("aisle");
      });
      indexingPerRows = indexingPerRows.slice(0, -1);
      seats.push(indexingPerRows);
    }
    console.log(seats);
    // seating process priority 1
    seats.forEach((row, rowIndex) => {
      row.forEach((seat, seatIndex) => {
        if (reamining < 1) {
          return;
        }
        if (seatIndex > 0 && seatIndex < row.length) {
          if (
            seat === "seat" &&
            (row[seatIndex - 1] === "aisle" || row[seatIndex + 1] === "aisle")
          ) {
            seats[rowIndex][seatIndex] = nextSeatNumber;
            nextSeatNumber++;
            reamining--;
          }
        }
      });
    });
    // seating process priority 2
    seats.forEach((row, rowIndex) => {
      row.forEach((seat, seatIndex) => {
        if (reamining < 1) {
          return;
        }
        if (
          seat === "seat" &&
          (seatIndex === 0 || seatIndex === row.length - 1)
        ) {
          seats[rowIndex][seatIndex] = nextSeatNumber;
          nextSeatNumber++;
          reamining--;
        }
      });
    });
    // seating process priority 3
    seats.forEach((row, rowIndex) => {
      row.forEach((seat, seatIndex) => {
        if (reamining < 1) {
          return;
        }
        if (
          seat === "seat" &&
          !(
            seatIndex === 0 ||
            seatIndex === row.length - 1 ||
            row[seatIndex - 1] === "aisle" ||
            row[seatIndex + 1] === "aisle"
          )
        ) {
          seats[rowIndex][seatIndex] = nextSeatNumber;
          nextSeatNumber++;
          reamining--;
        }
      });
    });
    setSeat(seats);
    setRemainingPassenger(reamining);
  }

  async function onHandleSubmit(e) {
    e.preventDefault();
    setSeat("");
    console.log(inputSeat);
    const bracketsRegex = /(\[*\]*)/g;
    const seats = inputSeat[0].split(/\s*]\s*,\s*\[\s*/).map((ele) => {
      const arr = ele.replace(bracketsRegex, "").split(",");
      if (arr.length !== 2) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! please follow the format [a,b] and use separator comma",
        });
        return;
      }
      return [+arr[0], +arr[1]];
    });
    if (!inputPassenger || parseInt(inputPassenger) < 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! please make sure the number of passenger >= 0",
      });
      return;
    }
    const fixedPenumpang = parseInt(inputPassenger);
    setRemainingPassenger(fixedPenumpang);
    const implement = await seatingAlgoritm2(seats, fixedPenumpang);
  }

  return (
    <>
      <h1 className="text-center">Airplane Seating Algorithm</h1>
      <p className="text-center">Remaining Passengers {remainingPassengers}</p>
      <div className="d-flex justify-content-center">
        <div className="w-25  ">
          <form className=" ">
            <div className="mb-3">
              <label className="form-label" htmlFor="inputseat">
                Input seat
              </label>
              <input
                // type="text"
                id="inputseat"
                className="form-control"
                placeholder="[3, 2], [4, 3], [2, 3], [3, 4]"
                onChange={(e) => onChangeInputSeat(e)}
              ></input>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="inputseat">
                Passengers
              </label>
              <input
                // type="text"
                id="inputseat"
                className="form-control"
                placeholder="30"
                onChange={(e) => onChangeInputPenumpang(e)}
              ></input>
            </div>
            <button
              type="button"
              class="btn btn-primary w-100"
              onClick={(e) => onHandleSubmit(e)}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="container p-5">
        {!seat ? (
          <></>
        ) : (
          seat.map((row, rowIndex) => {
            return (
              <div
                key={"row" + rowIndex}
                className="d-flex flex-row justify-content-center align-content-center"
              >
                {row.map((seat, seatIndex) => {
                  if (Number.isInteger(seat)) {
                    return (
                      <div
                        key={"seat" + seatIndex}
                        className="bg-danger p-2 seat border border-light text-center"
                      >
                        {seat}
                      </div>
                    );
                  }
                  if (seat === "seat") {
                    return (
                      <div
                        key={"seat" + seatIndex}
                        className="bg-success p-2 seat border border-light text-center"
                      ></div>
                    );
                  }
                  return (
                    <div
                      key={"seat" + seatIndex}
                      className="bg-light  p-2 seat border border-light text-center"
                    ></div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
      {seat ? (
        <>
          <div className="d-flex justify-content-center align-items-center">
            <div className="bg-success p-2 seat border border-light text-center"></div>
            <p className="p-3 fs-5">: Available</p>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
