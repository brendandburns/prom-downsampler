import { PrometheusDriver } from 'prometheus-query';
import { ConnectionPool, connect } from 'mssql';
import { readFileSync } from 'fs';

interface DownsampleConfig {
    promQuery: string;
    sqlQuery: string;
    name: string;
}

const queries: DownsampleConfig[] = JSON.parse(readFileSync('config.json', 'utf8'));

const prom = new PrometheusDriver({
    endpoint: "http://prometheus.burns.house",
    baseURL: "/api/v1"
});

const config = {
    server: "mssql.burns.house",
    database: "TimeSeries",
    options: {
        trustServerCertificate: true,
    },
    user: "sa",
    password: process.env.PASSWORD
};

async function downsample(queries: DownsampleConfig[], conn: ConnectionPool) {
    await Promise.all(queries.map(async (query) => {
        await downsampleQuery(query, conn);
    }));
}

async function downsampleQuery({ promQuery, sqlQuery, name }: DownsampleConfig, conn: ConnectionPool) {
    const res = await prom.instantQuery(promQuery)

    const series = res.result;
    const inserts = series.map((async (serie) => {
        const result = await conn.request()
            .input('name', name)
            .input('timestamp', serie.value.time)
            .input('value', serie.value.value)
            .query(sqlQuery);
        if (result.rowsAffected[0] !== 1) {
            console.log('Failed to insert row');
        }
    }));
    await Promise.all(inserts);
}

async function main() {
    const pool = new ConnectionPool(config);
    await pool.connect();
    await downsample(queries, pool);
    await pool.close();
}

main();
