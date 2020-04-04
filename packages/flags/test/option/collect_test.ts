import { parseFlags } from '../../lib/flags.ts';
import { IParseOptions, OptionType } from '../../lib/types.ts';
import { assertEquals, assertThrows } from '../lib/assert.ts';

const options = <IParseOptions>{
    allowEmpty: false,
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ],
        type: OptionType.STRING,
        optionalValue: true
    }, {
        name: 'string',
        aliases: [ 's' ],
        type: OptionType.STRING,
        collect: true
    }, {
        name: 'boolean',
        aliases: [ 'b' ],
        type: OptionType.BOOLEAN,
        collect: true
    }, {
        name: 'number',
        aliases: [ 'n' ],
        type: OptionType.NUMBER,
        collect: true
    } ]
};

Deno.test( function flags_optionCollect_flag() {

    assertThrows(
        () => parseFlags( [ '-f', '-f' ], options ),
        Error,
        'Duplicate option: -f'
    );
} );

Deno.test( function flags_optionCollect_flagLong() {

    assertThrows(
        () => parseFlags( [ '-f', '--flag' ], options ),
        Error,
        'Duplicate option: --flag'
    );
} );

Deno.test( function flags_optionCollect_flagTrueLongFalse() {

    assertThrows(
        () => parseFlags( [ '-f', 'true', '--flag', 'false' ], options ),
        Error,
        'Duplicate option: --flag'
    );
} );

Deno.test( function flags_optionCollect_flagTrueNoFlag() {

    assertThrows(
        () => parseFlags( [ '-f', 'true', '--no-flag' ], options ),
        Error,
        'Duplicate option: --no-flag'
    );
} );

Deno.test( function flags_optionCollect_flagTrueNoFlagTrue() {

    assertThrows(
        () => parseFlags( [ '-f', 'true', '--no-flag', 'true' ], options ),
        Error,
        'Duplicate option: --no-flag'
    );
} );

Deno.test( function flags_optionCollect_boolean() {

    const { flags, unknown, literal } = parseFlags( [ '-b', '1', '--boolean', '0' ], options );

    assertEquals( flags, { boolean: [ true, false ] } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionCollect_string() {

    const { flags, unknown, literal } = parseFlags( [ '-s', '1', '--string', '0' ], options );

    assertEquals( flags, { string: [ '1', '0' ] } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionCollect_number() {

    const { flags, unknown, literal } = parseFlags( [ '-n', '1', '--number', '0' ], options );

    assertEquals( flags, { number: [ 1, 0 ] } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );