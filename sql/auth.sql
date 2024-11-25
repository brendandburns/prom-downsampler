USE TimeSeries;
CREATE USER grafana FROM LOGIN grafana;
GRANT SELECT ON Series TO grafana;