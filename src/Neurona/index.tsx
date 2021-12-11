import {
  AppBar,
  Button,
  Container,
  FormControl,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useRef, useState } from "react";
import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      alignItems: "center",
    },
    top: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    forms: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      alignItems: "center",
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: "25ch",
    },
    typo: {
      paddingTop: "2em"
    },
    navbar: {
      margin: 0
    }
  })
);

export default function Neurona() {
  const classes = useStyles();
  //   referencias a los valores en los input
  const errorRef = useRef<HTMLInputElement>(null);
  const factorRef = useRef<HTMLInputElement>(null);
  const woneRef = useRef<HTMLInputElement>(null);
  const wtwoRef = useRef<HTMLInputElement>(null);
  const xoneRef = useRef<HTMLInputElement>(null);
  const xtwoRef = useRef<HTMLInputElement>(null);

  // Valores para el entrenamiento
  const [error, setError] = useState(0);
  const [e, setE] = useState(0);
  const [wone, setWone] = useState(0);
  const [wtwo, setWtwo] = useState(0);

  const countRef = useRef(0);
  const [iteraciones, setIteraciones] = useState(0)

  // Valores para las pruebas
  const [result, setResult] = useState(0);

  const getValues = async (e: any) => {
    e.preventDefault();
    try {
      const err = await +errorRef.current!.value;
      const e = await +factorRef.current!.value;
      const w1 = await +woneRef.current!.value;
      const w2 = await +wtwoRef.current!.value;
      console.log("getvalues: ", err);
      entrenar(err, e, w1, w2);
    } catch (error) {
      console.log(error);
    }
  };

  const reset = () => {
    setIteraciones(countRef.current)
    countRef.current = 0;
    console.log("VALORES RESETEADOS\n");
  };
  const cambio = (err: number, ce: number, cw1: number, cw2: number) => {
    setError(err);
    setE(ce);
    setWone(cw1);
    setWtwo(cw2);
  };

  const entrenar = async (erro: number, e: number, w1: number, w2: number) => {
  // setIteraciones(iteraciones +1);
    console.log("Iteracion: ", countRef.current++);
    if (countRef.current < 1000) {
      console.log("entrenar: ", erro, e, w1, w2);
      // Obtener el valor de la primera salida
      const y1 = Math.round(Math.tanh(1 * w1 + 1 * w2) + e) < 0 ? -1 : 1;
      const y2 = Math.round(Math.tanh(1 * w1 + -1 * w2) + e) < 0 ? -1 : 1;
      const y3 = Math.round(Math.tanh(-1 * w1 + 1 * w2) + e) < 0 ? -1 : 1;
      const y4 = Math.round(Math.tanh(-1 * w1 + -1 * w2) + e) < 0 ? -1 : 1;
      if (y1 === -1) {
        await recalcular(w1, w2, e, 1, 1, 1, erro, y1);
      } else if (y2 === -1) {
        await recalcular(w1, w2, e, 1, 1, -1, erro, y2);
      } else if (y3 === -1) {
        await recalcular(w1, w2, e, 1, -1, 1, erro, y3);
      } else if (y4 === 1) {
        await recalcular(w1, w2, e, -1, -1, -1, erro, y4);
      } else {
        console.log("EXITOSO");
        cambio(erro, e, w1, w2);
        await reset();
        return;
      }
    } else {
      console.log("Muchas iteracines");
      cambio(erro, e, w1, w2);
      alert("Se alcanzó el límite de 1000 iteraciones, por favor cambie los valores")
      await reset();
      return;
    }
    return;
  };

  const recalcular = async (
    w1: number,
    w2: number,
    e: number,
    y: number,
    x1: number,
    x2: number,
    err: number, obtenido:number
  ) => {
    console.log("recalcular: ", w1, w2, e, y, x1, x2, err);
    const newW1 = w1 + e * (y - obtenido)* x1;
    const newW2 = w2 + e * (y - obtenido)* x2;
    const newErr = err + e * (y - obtenido)* -1;
    console.log("recalcular2: ", newW1, newW2, newErr, e, y, x1, x2);
    await entrenar(newErr, e, newW1, newW2);
  };

  const getCalc = (e: any) => {
    e.preventDefault();
    const xone = +xoneRef.current!.value
    const xtwo = +xtwoRef.current!.value
    const resultado = Math.tanh((wone*xone) + (wtwo*xtwo) - error)
    setResult(resultado)
    console.log(`Calculado: tanh((${wone} * ${xone}) + (${wtwo} * ${xtwo}) + ${error})`);
  };

  return (
    <Container className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.navbar}>
          <Button color="inherit" variant="outlined">Btn</Button>
        </Toolbar>
      </AppBar>
      <Container className={classes.top}>
        {/* Esta es la parte del entrenamiento */}
        <Container className={classes.forms}>
          <FormControl
            className={clsx(
              classes.margin,
              classes.withoutLabel,
              classes.textField
            )}
          >
            <TextField
              className={clsx(classes.margin, classes.textField)}
              id="error-field"
              label="Error"
              inputRef={errorRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">&#216;</InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              className={clsx(classes.margin, classes.textField)}
              id="factor-field"
              label="Factor"
              inputRef={factorRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">E</InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              className={clsx(classes.margin, classes.textField)}
              id="wone-field"
              label="Weight 1"
              inputRef={woneRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">W1</InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              className={clsx(classes.margin, classes.textField)}
              id="wtwo-field"
              label="Weight 2"
              inputRef={wtwoRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">W2</InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </FormControl>
          <Button
            variant="contained"
            onClick={(e) => getValues(e)}
            color="primary"
          >
            Run
          </Button>
        </Container>
        {/* Esta es la parte de las pruebas */}
        <Container className={classes.forms}>
          <FormControl
            className={clsx(
              classes.margin,
              classes.withoutLabel,
              classes.textField
            )}
          >
            <TextField
              className={clsx(classes.margin, classes.textField)}
              id="xone-field"
              label="X1"
              inputRef={xoneRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">X1</InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              className={clsx(classes.margin, classes.textField)}
              id="xtwo-field"
              label="X2"
              inputRef={xtwoRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">X2</InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </FormControl>
          <Button
            variant="contained"
            onClick={(e) => getCalc(e)}
            color="primary"
          >
            Run
          </Button>
          <Typography className={classes.typo}>Y = {result}</Typography>
        </Container>
      </Container>
      {/* Esta es la parte donde se muestran los resultados */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Error</TableCell>
              <TableCell>Factor de aprendizaje</TableCell>
              <TableCell>Weight 1</TableCell>
              <TableCell>Weight 2</TableCell>
              <TableCell>Iteraciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="right">{error}</TableCell>
              <TableCell align="right">{e}</TableCell>
              <TableCell align="right">{wone}</TableCell>
              <TableCell align="right">{wtwo}</TableCell>
              <TableCell align="right">{iteraciones}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
