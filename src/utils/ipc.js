import { propertiesNamesReplacer } from './json'


const sendObserverState = (observer, audio) => audio.send({
  kind: 'tap-stream-observer-state',
  value: JSON.stringify(observer, propertiesNamesReplacer(observer)),
})
export const connectObserverToAudio = (observer, audio) => {
  sendObserverState(observer, audio)
  observer.on('changed', () => sendObserverState(observer, audio))
}
