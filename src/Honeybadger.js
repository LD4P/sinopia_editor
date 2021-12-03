import Config from "Config"
import { Honeybadger } from "@honeybadger-io/react"

const HoneybadgerNotifier = Honeybadger.configure({
  apiKey: Config.honeybadgerApiKey,
  environment: process.env.SINOPIA_ENV,
  revision: Config.honeybadgerRevision,
})

export default HoneybadgerNotifier
