import { Communicator } from '@leanoncompany/supporti-utility';
import axios from 'axios';

export class ControllerABC extends Communicator {
  //* 클래스 멤버
  public rootRoute: string = process.env.NEXT_PUBLIC_ROOT_ROUTE || '/api';
  private role: string = process.env.NEXT_PUBLIC_CONTROLLER_ROLE || 'admin';
  private modelName?: string;
  public mergedPath?: string;
  private modelConfig:
    | {
        [method: string]: {
          [option: string]: { KEY: string; METHOD: string }[];
        };
      }
    | undefined = undefined;

  constructor(modelName?: string, role?: string) {
    super();

    if (role !== undefined) {
      this.role = role;
    }

    this.modelName = modelName;

    if (this.modelName !== undefined) {
      this.mergedPath = `${this.rootRoute}/${this.role}/${this.modelName
        .replace(/([A-Z])/g, '_$1')
        .replace(/^_/, '') // 문자열 시작이 "_"일 경우 제거
        .toLowerCase()}`;
      // this.getModelConfig();
    }
  }

  /**
   * 모델 설정 가져오는 함수
   */
  public async getModelConfig() {
    const response = await axios.get(`${this.rootRoute}/common/model/find_one`, {
      params: {
        MODEL_NAME: this.modelName,
      },
    });

    if (response.data.result === undefined || response.data.result === null) {
      this.modelConfig = {};
    } else {
      this.modelConfig = response.data.result;
    }

    return response;
  }

  /**
   * 인자 설저
   */
  private setArgs(args: { [key: string]: any }, method: string, option: string) {
    let convertedArgs: { [key: string]: any } = {};

    if (this.modelConfig !== undefined) {
      const targets = this.modelConfig[method][option];

      targets.map((target) => {
        if (target.KEY in args) {
          convertedArgs[target.KEY] = args[target.KEY];
        }
      });
    } else {
      throw new Error('Model config is undefined');
    }

    return convertedArgs;
  }

  /**
   * 키 값으로 찾아오는 함수
   * @param args
   * @param successCallback
   * @param failCallback
   */
  public getOneItemByKey(
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void,
    returnPromise?: boolean
  ) {
    if (this.mergedPath !== undefined) {
      return this.getData(args, `${this.mergedPath}/find_by_key`, successCallback, failCallback, returnPromise);
    } else {
      throw new Error('Merged path is undefined');
    }
  }

  /**
   * 생성 함수
   */
  public createItem(
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void,
    returnPromise?: boolean
  ) {
    if (this.mergedPath !== undefined) {
      if (this.modelConfig === undefined) {
        return this.getModelConfig().then(() => {
          return this.postData(
            {
              CREATE_OPTION_KEY_LIST: this.setArgs(args, 'CREATE', 'CREATE_OPTION_KEY_LIST'),
            },
            `${this.mergedPath}/create`,
            successCallback,
            failCallback,
            false,
            returnPromise
          );
        });
      } else {
        return this.postData(
          {
            CREATE_OPTION_KEY_LIST: this.setArgs(args, 'CREATE', 'CREATE_OPTION_KEY_LIST'),
          },
          `${this.mergedPath}/create`,
          successCallback,
          failCallback,
          false,
          returnPromise
        );
      }
    } else {
      throw new Error('Merged path is undefined');
    }
  }

  /**
   * 업데이트 함수
   */
  public updateItem(
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void,
    returnPromise?: boolean
  ) {
    if (this.mergedPath !== undefined) {
      if (this.modelConfig === undefined) {
        return this.getModelConfig().then(() => {
          return this.putData(
            {
              FIND_OPTION_KEY_LIST: this.setArgs(args, 'UPDATE', 'FIND_OPTION_KEY_LIST'),
              UPDATE_OPTION_KEY_LIST: this.setArgs(args, 'UPDATE', 'UPDATE_OPTION_KEY_LIST'),
            },
            `${this.mergedPath}/update`,
            successCallback,
            failCallback,
            returnPromise
          );
        });
      } else {
        return this.putData(
          {
            FIND_OPTION_KEY_LIST: this.setArgs(args, 'UPDATE', 'FIND_OPTION_KEY_LIST'),
            UPDATE_OPTION_KEY_LIST: this.setArgs(args, 'UPDATE', 'UPDATE_OPTION_KEY_LIST'),
          },
          `${this.mergedPath}/update`,
          successCallback,
          failCallback,
          returnPromise
        );
      }
    } else {
      throw new Error('Merged path is undefined');
    }
  }

  /**
   * 데이터 하나 가져오는 함수
   */
  public getOneItem(
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void,
    returnPromise?: boolean
  ) {
    if (this.mergedPath !== undefined) {
      if (this.modelConfig === undefined) {
        return this.getModelConfig().then(() => {
          return this.getData(
            {
              FIND_OPTION_KEY_LIST: this.setArgs(args, 'FIND_ONE', 'FIND_OPTION_KEY_LIST'),
            },
            `${this.mergedPath}/find_one`,
            successCallback,
            failCallback,
            returnPromise
          );
        });
      } else {
        return this.getData(
          {
            FIND_OPTION_KEY_LIST: this.setArgs(args, 'FIND_ONE', 'FIND_OPTION_KEY_LIST'),
          },
          `${this.mergedPath}/find_one`,
          successCallback,
          failCallback,
          returnPromise
        );
      }
    } else {
      throw new Error('Merged path is undefined');
    }
  }

  /**
   * 데이터 여러개 가져오는 함수
   */
  public findAllItems(
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void,
    returnPromise?: boolean
  ) {
    if (this.mergedPath !== undefined) {
      if (this.modelConfig === undefined) {
        return this.getModelConfig().then(() => {
          return this.getData(
            {
              FIND_OPTION_KEY_LIST: this.setArgs(args, 'FIND_ALL', 'FIND_OPTION_KEY_LIST'),
            },
            `${this.mergedPath}/find_all`,
            successCallback,
            failCallback,
            returnPromise
          );
        });
      } else {
        return this.getData(
          {
            FIND_OPTION_KEY_LIST: this.setArgs(args, 'FIND_ALL', 'FIND_OPTION_KEY_LIST'),
          },
          `${this.mergedPath}/find_all`,
          successCallback,
          failCallback,
          returnPromise
        );
      }
    } else {
      throw new Error('Merged path is undefined');
    }
  }

  /**
   * 데이터 여러개 조인시켜서 가져오는 함수
   */
  public getAllItems(
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void,
    returnPromise?: boolean
  ) {
    if (this.mergedPath !== undefined) {
      if (this.modelConfig === undefined) {
        return this.getModelConfig().then(() => {
          return this.getData(
            {
              FIND_OPTION_KEY_LIST: this.setArgs(args, 'FIND_ALL', 'FIND_OPTION_KEY_LIST'),
            },
            `${this.mergedPath}/find_all_by_joined_key`,
            successCallback,
            failCallback,
            returnPromise
          );
        });
      } else {
        return this.getData(
          {
            FIND_OPTION_KEY_LIST: this.setArgs(args, 'FIND_ALL', 'FIND_OPTION_KEY_LIST'),
          },
          `${this.mergedPath}/find_all_by_joined_key`,
          successCallback,
          failCallback,
          returnPromise
        );
      }
    } else {
      throw new Error('Merged path is undefined');
    }
  }

  /**
   * 데이터 삭제하는 함수
   */
  public deleteItem(
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void,
    returnPromise?: boolean
  ) {
    if (this.mergedPath !== undefined) {
      if (this.modelConfig === undefined) {
        return this.getModelConfig().then(() => {
          return this.putData(
            {
              FIND_OPTION_KEY_LIST: this.setArgs(args, 'DELETE', 'FIND_OPTION_KEY_LIST'),
            },
            `${this.mergedPath}/delete`,
            successCallback,
            failCallback,
            returnPromise
          );
        });
      } else {
        return this.putData(
          {
            FIND_OPTION_KEY_LIST: this.setArgs(args, 'DELETE', 'FIND_OPTION_KEY_LIST'),
          },
          `${this.mergedPath}/delete`,
          successCallback,
          failCallback,
          returnPromise
        );
      }
    } else {
      throw new Error('Merged path is undefined');
    }
  }
}
