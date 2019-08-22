/** Extended meta data */
declare interface ExtendedMeta {
  name: string,
  description: string,
  image: string,
  properties: Properties
}

declare interface Properties {
  simpleProperty: string,
  richProperty: JSON
}
