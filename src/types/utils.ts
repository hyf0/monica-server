export interface DynamicImportedModule {
  default?: any;
  [exportedProp: string]: any;
}
