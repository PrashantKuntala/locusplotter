# plotter

### Dependencies

- NodeJS (LTS)
- MongoDB

#### Setup

- use `npm install` to install dependencies in each of the folders. `npm start` from each of the folders boots up the application. frontend is bootstrapped using `create-react-app`.
- `backend` requires a `.env` file with below values specified according to your needs:

| .env variable | description                                                         |
| ------------- | ------------------------------------------------------------------- |
| DB_URL        | localhost (for most local developments and production deployments ) |
| DB_NAME       | mongoDB's database name that contains the data                      |
| NODE_PORT     | port on which the api needs to be served, use 8081 as default       |

- Below is an example of `.env` file that works for local development.

```
DB_URL=localhost
DB_NAME=roiDB
NODE_PORT=8081
```

- `utils` folder contains sample data and useful scripts to POST sample data into the backend.

#### Generating data for the app

The `utils` directory contains :

| Script                      | Description                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------- |
| `createFastaData.py`        | creates a `POST`able JSON file from csv file with nucleotide values                    |
| `generateJson.py`           | creates an `intermediate` JSON file from csv file with Composite values                |
| `appendScalingFactor.py`    | adds scaling factors to the `intermediate` JSON and generate the final `POST`able JSON |
| `generateStandaloneData.py` | generates a JSON file that can be used by the standalone version of the tool.          |

**Input data format and script usage**

| Script                      | Usage example                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `createFastaData.py`        | `python createFastaData.py sampleData/rawFasta.csv`                                               |
| `generateJson.py`           | `python generateJson.py sampleData/rawComposite.csv > sampleData/exampleComposite.json`           |
| `appendScalingFactor.py`    | `python appendScalingFactor.py sampleData/scalingFactors_tt.csv sampleData/exampleComposite.json` |
| `generateStandaloneData.py` | `python generateStandaloneData.py > example.json`                                                 |

#### Available Endpoints

| Endpoint example                                           | HTTP Request | description                                                                                       |
| ---------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| http://localhost:8081/datasets/                            | GET          | Retrieve all the gene categories available.                                                       |
| http://localhost:8081/datasets/refs?category=STM           | GET          | get all unique reference points for a given category; requires query string -- category=value     |
| http://localhost:8081/datasets/data?category=STM&ref=Abf1  | GET          | get all datasets for a unique category + ref ; requires query strings -- category=value&ref=value |
| http://localhost:8081/datasets/fasta?category=STM&ref=Abf1 | GET          | get fasta sequence for a ref ; requires query strings -- category=value&ref=value                 |
| http://localhost:8081/datasets/                            | POST         | create a new dataset                                                                              |
| http://localhost:8081/fasta/                               | POST         | create a new fasta sequence                                                                       |
