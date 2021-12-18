import arg from 'arg'

export const parseArgs = (rawArgs: string[], spec: arg.Spec) => {
  const args = arg(spec, { argv: rawArgs.slice(2) })
  return args
}
