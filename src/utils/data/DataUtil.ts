import { IWrappedData } from '../../@types/base/data';

class DataUtil {
	public flatWrapedDataDict(wrappedDataDict: {
		[key: string]: IWrappedData;
	}) {
		const flattenedDataDict: { [key: string]: any } = {};

		Object.keys(wrappedDataDict).forEach((key) => {
			flattenedDataDict[key] = wrappedDataDict[key].state;
		});

		return flattenedDataDict;
	}

	public convertATypeFormattedDate(aTypeDateString: string): string {
		const [datePart, meridiem, hour, minute] = aTypeDateString.split(' ');

		// 날짜 부분 파싱
		const [year, month, day] = datePart.split('/');
		const formattedDate = `${year}/${month}/${day}`;

		// 시간 부분 파싱
		const hourNumber = Number(hour.replace('시', ''));
		const formattedHour =
			meridiem === '오후' && hourNumber < 12
				? hourNumber + 12
				: hourNumber;
		const formattedTime = `${formattedHour
			.toString()
			.padStart(2, '0')}시 ${minute.replace('분', '')}분`;

		const formattedDateTime = `${formattedDate} ${meridiem} ${formattedTime}`;
		return formattedDateTime;
	}

	public convertToUpperCasedUnderbarSeparated(word: string): string {
		return word
			.replace(/([A-Z])/g, '_$1')
			.replace(/^_/, '') // 문자열 시작이 "_"일 경우 제거
			.toUpperCase();
	}

	public convertToLowerCasedUnderbarSeparated(word: string): string {
		return word
			.replace(/([A-Z])/g, '_$1')
			.replace(/^_/, '') // 문자열 시작이 "_"일 경우 제거
			.toLowerCase();
	}

	public convertUpderbarSeparatedToUpperCased(input: string): string {
		const words = input.toLowerCase().split('_');
		const result = words
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
		return result.charAt(0).toUpperCase() + result.slice(1);
	}

	public getModelIdentificationCode(modelName: string): string {
		return (
			this.convertToUpperCasedUnderbarSeparated(modelName) +
			'_IDENTIFICATION_CODE'
		);
	}

	public getModelIdentificationCodeFromWrappedDataSet(
		modelData: {
			[key: string]: IWrappedData;
		},
		modelName: string
	): any {
		return modelData[this.getModelIdentificationCode(modelName)].state;
	}

	/**
	 * 상대 경로 절대 경로로 변환
	 */
	public normalizePath(link: string): string {
		const parts = link.split('/');
		const result = [];

		// 경로를 "/"로 구분된 문자열로 조합한다.
		for (let i = 0; i < parts.length; i++) {
			if (parts[i] === '..') {
				result.pop();
			} else if (parts[i] !== '.' && parts[i] !== '') {
				result.push(parts[i]);
			}
		}

		return ('/' + result.join('/')).replace('/?', '?');
	}

	/**
	 * 컴마를 포함한 숫자를 반환한다.
	 */
	public numberWithCommas(x: number): string {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
}

export default DataUtil;
