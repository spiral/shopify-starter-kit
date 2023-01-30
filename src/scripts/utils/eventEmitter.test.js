import { EventEmitter } from './eventEmitter';

describe('EventEmitter', () => {
  const mockFn = jest.fn((value) => `${String(value)}!`);
  const mockFn2 = jest.fn((value) => `${String(value)}!!`);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('subscribe method', () => {
    const EE = new EventEmitter();

    const testData = [mockFn, 0, 2, '', 'test', null, undefined, [], {}, /\\/];

    jest.spyOn(global.console, 'error').mockImplementation();

    testData.forEach((value) => {
      EE.subscribe(value);
    });

    expect(global.console.error).toHaveBeenCalledTimes(testData.length - 1);

    EE.emit('one');
  });

  it('emit method', () => {
    const EE = new EventEmitter();

    EE.subscribe(mockFn);

    EE.emit('one');

    expect(mockFn.mock.calls[0][0]).toBe('one');
    expect(mockFn.mock.results[0].value).toBe('one!');
    expect(mockFn.mock.calls.length).toBe(1);

    EE.subscribe(mockFn2);

    EE.emit('two');

    expect(mockFn.mock.calls[1][0]).toBe('two');
    expect(mockFn.mock.results[1].value).toBe('two!');
    expect(mockFn.mock.calls.length).toBe(2);

    expect(mockFn2.mock.calls[0][0]).toBe('two');
    expect(mockFn2.mock.results[0].value).toBe('two!!');
    expect(mockFn2.mock.calls.length).toBe(1);
  });

  it('unsubscribe method', () => {
    const EE = new EventEmitter();

    EE.subscribe(mockFn);

    EE.emit('one');

    expect(mockFn.mock.calls.length).toBe(1);

    EE.unsubscribe(mockFn);

    EE.emit('two');

    expect(mockFn.mock.calls.length).toBe(1);
  });

  it('clear method', () => {
    const EE = new EventEmitter();

    EE.subscribe(mockFn);
    EE.subscribe(mockFn2);

    EE.emit('one');

    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn2.mock.calls.length).toBe(1);

    EE.clear();

    EE.emit('two');

    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn2.mock.calls.length).toBe(1);
  });
});
